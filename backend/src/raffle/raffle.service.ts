import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Raffle, RaffleStatus } from './entities/raffle.entity';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RaffleService {
    constructor(
        @InjectRepository(Raffle)
        private repo: Repository<Raffle>,
    ) { }

    async create(dto: CreateRaffleDto) {
        this.validate(dto);

        const raffle = this.repo.create({
            ...dto,
            totalTicketLimit: dto.totalTicketLimit ?? undefined,
            prizes: dto.prizes,
        });

        return this.repo.save(raffle);
    }

    async findAll(params: {
        page: number;
        limit: number;
        status?: RaffleStatus;
        startDate?: string;
        endDate?: string;
    }) {
        const { page, limit, status, startDate, endDate } = params;

        const query = this.repo.createQueryBuilder('raffle');

        // filtering
        if (status) {
            query.andWhere('raffle.status = :status', { status });
        }

        if (startDate) {
            query.andWhere('raffle.createdAt >= :startDate', { startDate });
        }

        if (endDate) {
            query.andWhere('raffle.createdAt <= :endDate', { endDate });
        }

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
        const raffle = await this.repo.findOne({ where: { id } });
        if (!raffle) throw new NotFoundException('Raffle not found');
        return raffle;
    }

    async update(id: string, dto: UpdateRaffleDto) {
        const existing = await this.repo.findOne({
            where: { id },
            relations: ['prizes']
        });

        if (!existing) throw new NotFoundException('Raffle not found');

        if (existing.status === RaffleStatus.DRAWN) {
            throw new BadRequestException('Cannot edit drawn raffle');
        }

        this.validate({ ...existing, ...dto });

        // delete old images if changed
        if (dto.prizes) {
            const oldImgs = existing.prizes.map(p => p.imageUrl);
            const newImgs = dto.prizes.map(p => p.imageUrl);

            const toDelete = oldImgs.filter(i => !newImgs.includes(i));

            await Promise.all(
                toDelete.map(async (img) => {
                    const filename = img.split('/uploads/')[1];
                    if (!filename) return;

                    const filePath = path.join(process.cwd(), 'uploads', filename);
                    try {
                        await fs.promises.unlink(filePath);
                    } catch { }
                })
            );

            existing.prizes = dto.prizes as any;
        }

        Object.assign(existing, dto);
        return this.repo.save(existing);
    }

    private validate(dto: any) {
        if (new Date(dto.endDate) <= new Date(dto.startDate)) {
            throw new BadRequestException('endDate must be after startDate');
        }

        if (new Date(dto.drawDate) <= new Date(dto.endDate)) {
            throw new BadRequestException('drawDate must be after endDate');
        }
    }
}