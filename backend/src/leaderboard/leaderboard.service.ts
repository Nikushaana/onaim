import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Leaderboard, LeaderboardStatus } from './entities/leaderboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(Leaderboard)
        private repo: Repository<Leaderboard>,
    ) { }

    async create(dto: CreateLeaderboardDto) {
        this.validateBusinessRules(dto);

        const leaderboard = this.repo.create({
            ...dto,
            prizes: dto.prizes.map((prize) => ({
                rank: prize.rank,
                name: prize.name,
                type: prize.type,
                amount: prize.amount,
                imageUrl: prize.imageUrl,
            })),
        });

        return this.repo.save(leaderboard);
    }

    async findAll(params: {
        page: number;
        limit: number;
        status?: LeaderboardStatus;
        sortBy: keyof Leaderboard;
        order: 'ASC' | 'DESC';
    }) {
        const { page, limit, status, sortBy, order } = params;

        const query = this.repo.createQueryBuilder('leaderboard');

        // filtering
        if (status) {
            query.andWhere('leaderboard.status = :status', { status });
        }

        // sorting
        query.orderBy(`leaderboard.${sortBy}`, order);

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
        const data = await this.repo.findOne({ where: { id } });
        if (!data) throw new NotFoundException('Leaderboard not found');
        return data;
    }

    async update(id: string, dto: UpdateLeaderboardDto) {
        const existing = await this.repo.findOne({
            where: { id },
            relations: ['prizes'],
        });

        if (!existing) {
            throw new NotFoundException('Leaderboard not found');
        }

        const merged = {
            ...existing,
            ...dto,
            prizes: dto.prizes ?? existing.prizes,
        };

        this.validateBusinessRules(merged);

        // ✅ HANDLE IMAGE DELETION
        if (dto.prizes) {
            const oldImages = existing.prizes.map(p => p.imageUrl);
            const newImages = dto.prizes.map(p => p.imageUrl);

            // find images that are removed or replaced
            const imagesToDelete = oldImages.filter(
                (oldImg) => !newImages.includes(oldImg)
            );

            await Promise.all(
                imagesToDelete.map(async (imgUrl) => {
                    if (!imgUrl) return;

                    const filename = imgUrl.split('/uploads/')[1];
                    if (!filename) return;

                    const filePath = path.join(process.cwd(), 'uploads', filename);

                    try {
                        await fs.promises.unlink(filePath);
                    } catch (err) {
                        // ignore if file not found
                    }
                })
            );

            // replace prizes
            existing.prizes = dto.prizes.map((prize) => ({
                rank: prize.rank,
                name: prize.name,
                type: prize.type,
                amount: prize.amount,
                imageUrl: prize.imageUrl,
            })) as any;
        }

        Object.assign(existing, dto);

        return this.repo.save(existing);
    }

    async remove(id: string) {
        const leaderboard = await this.repo.findOne({
            where: { id },
            relations: ['prizes'],
        });

        if (!leaderboard) {
            throw new NotFoundException('Leaderboard not found');
        }

        // delete images from disk
        leaderboard.prizes.forEach((prize) => {
            if (prize.imageUrl) {
                const filename = prize.imageUrl.split('/uploads/')[1];

                if (filename) {
                    const filePath = path.join(process.cwd(), 'uploads', filename);

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        });

        // delete leaderboard (cascade deletes prizes)
        await this.repo.remove(leaderboard);

        return { message: 'Leaderboard deleted successfully' };
    }

    // Business validation rules
    private validateBusinessRules(dto: any) {
        if (new Date(dto.endDate) <= new Date(dto.startDate)) {
            throw new BadRequestException('endDate must be after startDate');
        }

        const ranks = dto.prizes.map((p) => p.rank);

        const uniqueRanks = new Set(ranks);
        if (uniqueRanks.size !== ranks.length) {
            throw new BadRequestException('Prize ranks must be unique');
        }

        const sorted = [...ranks].sort((a, b) => a - b);
        sorted.forEach((rank, index) => {
            if (rank !== index + 1) {
                throw new BadRequestException(
                    'Prize ranks must be sequential starting from 1',
                );
            }
        });
    }
}