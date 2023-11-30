import { BaseEntity } from './BaseEntity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { Context } from '@apollosoftwarexyz/cinnamon';
import { User } from './User';

export enum AssetType {
    PROFILE_IMAGE = 'profileImage',
}

@Entity({ tableName: 'assets' })
export class Asset extends BaseEntity {

    @Enum({ items: () => AssetType })
    type: AssetType = AssetType.PROFILE_IMAGE;

    @Property({ columnType: 'text', nullable: true })
    name?: string;

    @Property({ columnType: 'text' })
    mimeType!: string;

    @Property()
    payload!: Buffer;

    @Property()
    createdAt: Date = new Date();

    @Property({ columnType: 'jsonb', nullable: true })
    metadata?: any;

    @ManyToOne({ onDelete: 'cascade' })
    owner!: User;

    constructor(fields: {
        mimeType: string;
        payload: Buffer;
        name?: string;
        metadata?: any;
        owner: User;
    }) {
        super();

        this.mimeType = fields.mimeType;
        this.payload = fields.payload;
        this.owner = fields.owner;

        if (fields.name) this.name = fields.name;
        if (fields.metadata) this.metadata = fields.metadata;
    }

}

export async function decodeBase64Asset(ctx: Context, encoded: string) {
    const encodedImageData = encoded.split(',')[1];
    const extension = encoded.split('image/')[1].split(';')[0];

    if (!/^[a-zA-Z]+$/.test(extension) || extension.length > 5) {
        throw new Error('Invalid filename or extension');
    }

    const imageData = Buffer.from(encodedImageData, 'base64');
    return { imageData, extension, mimeType: `image/${extension}` };
}
