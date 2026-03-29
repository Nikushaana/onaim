import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wheel, WheelStatus } from './entities/wheel.entity';
import { CreateWheelDto } from './dto/create-wheel.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WheelService {
    constructor(
        @InjectRepository(Wheel)
        private readonly wheelRepo: Repository<Wheel>,
    ) { }

    async create(dto: CreateWheelDto) {
        this.validateWheel(dto);

        const wheel = this.wheelRepo.create({
            ...dto,
        });

        return this.wheelRepo.save(wheel);
    }

    async findAll(params: {
        page: number;
        limit: number;
        status?: WheelStatus;
        sortBy: keyof Wheel;
        order: 'ASC' | 'DESC';
    }) {
        const { page, limit, status, sortBy, order } = params;

        const query = this.wheelRepo.createQueryBuilder('wheel');

        // filtering
        if (status) {
            query.andWhere('wheel.status = :status', { status });
        }

        // sorting
        query.orderBy(`wheel.${sortBy}`, order);

        // pagination
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string) {
        const wheel = await this.wheelRepo.findOne({
            where: { id },
        });

        if (!wheel) {
            throw new NotFoundException('Wheel not found');
        }

        return wheel;
    }

    async update(id: string, dto: CreateWheelDto) {
        const existing = await this.wheelRepo.findOne({
            where: { id },
            relations: ['segments'],
        });

        if (!existing) {
            throw new NotFoundException('Wheel not found');
        }

        this.validateWheel({
            ...existing,
            ...dto,
            segments: dto.segments ?? existing.segments,
        });

        if (dto.segments) {
            const oldImages = existing.segments.map((s) => s.imageUrl);
            const newImages = dto.segments.map((s) => s.imageUrl);

            const imagesToDelete = oldImages.filter(
                (oldImg) => !newImages.includes(oldImg),
            );

            await Promise.all(
                imagesToDelete.map(async (imgUrl) => {
                    if (!imgUrl) return;

                    const filename = imgUrl.split('/uploads/')[1];
                    if (!filename) return;

                    const filePath = path.join(
                        process.cwd(),
                        'uploads',
                        filename,
                    );

                    try {
                        await fs.promises.unlink(filePath);
                    } catch (err) {
                    }
                }),
            );

            existing.segments = dto.segments.map((segment) => ({
                label: segment.label,
                color: segment.color,
                weight: segment.weight,
                prizeType: segment.prizeType,
                prizeAmount: segment.prizeAmount,
                imageUrl: segment.imageUrl,
            })) as any;
        }

        Object.assign(existing, dto);

        return this.wheelRepo.save(existing);
    }

    private validateWheel(dto: CreateWheelDto) {
        // 1. Weight sum = 100
        const totalWeight = dto.segments.reduce(
            (sum, s) => sum + s.weight,
            0,
        );

        if (totalWeight !== 100) {
            throw new BadRequestException(
                'Segment weights must sum to 100',
            );
        }

        // 2. Prize rules
        dto.segments.forEach((s) => {
            if (s.prizeType === 'nothing' && s.prizeAmount !== 0) {
                throw new BadRequestException(
                    'prizeAmount must be 0 when prizeType is nothing',
                );
            }

            if (s.prizeType !== 'nothing' && s.prizeAmount <= 0) {
                throw new BadRequestException(
                    'prizeAmount must be greater than 0',
                );
            }
        });
    }
}