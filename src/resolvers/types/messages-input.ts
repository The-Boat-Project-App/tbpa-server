import { Field, InputType, ID } from 'type-graphql'

import { Messages } from '../../models/messages.model'

@InputType()
export class MessagesInput implements Partial<Messages> {
  @Field(() => ID, { nullable: true })
  id: string

  @Field(() => String, { nullable: true })
  author: string

  @Field(() => Date, { nullable: true })
  createdAt: Date

  @Field(() => String, { nullable: true })
  content: string

  @Field(() => String, { nullable: true })
  mainPicture: string
}
