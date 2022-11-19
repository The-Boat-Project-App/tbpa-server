import { prop as Property, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'
import { Users } from './users.model'

@ObjectType({ description: 'The Messages Model' })
@modelOptions({ schemaOptions: { collection: 'messages', timestamps: true } })
export class Messages {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => Users, { nullable: true })
  @Property({ ref: () => Users, type: () => String, required: true })
  public author?: Ref<Users>

  @Field(() => String, { nullable: true })
  @Property({ type: () => String, required: false })
  mainPicture: string

  @Field(() => String, { nullable: true })
  @Property({ type: () => String, required: false })
  content: string

  @Field(() => Date, { nullable: true })
  @Property({ required: true, default: Date.now })
  createdAt: Date
}

export const MessagesModel = getModelForClass(Messages)
