import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Subscription,
  PubSub,
  PubSubEngine,
  UseMiddleware,
  Ctx,
  Root,
  Args,
} from 'type-graphql'
import { MessagesModel, Messages } from '../models/messages.model'
import { Users } from '../models/users.model'
import { MessagesInput } from './types/messages-input'
import { MyContext } from './MyContext'

import { isAuth } from './isAuth'

@Resolver((_of) => Messages)
export class MessagesResolver {
  @Query(() => [Messages], { name: 'MessagesList', description: 'Get List of Messages' })
  async getAllMessages() {
    console.log('resolver getallmessages')
    const allMessagesInDb = await MessagesModel.find()
      .populate({ path: 'author', model: Users })
      .exec()
    console.log('allMessagesInDb', allMessagesInDb)
    return allMessagesInDb
  }

  @Mutation(() => Messages, { name: 'createMessages' })
  @UseMiddleware(isAuth)
  async createMessages(
    @Arg('newMessagesInput')
    { content, mainPicture = null }: MessagesInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload }: MyContext,
  ): Promise<Messages> {
    const Messages = await MessagesModel.create({
      content,
      author: payload.userId,
      mainPicture,
    })

    const savedMessage = await Messages.save()
    console.log(savedMessage)
    const newMessageInDb = await MessagesModel.findOne({ _id: savedMessage.id })
      .populate({ path: 'author', model: Users })
      .exec()
    // console.log('newMessageInDb', newMessageInDb)
    //   .populate({ path: 'author', model: Users })
    //   .exec()
    const { id, author, createdAt } = newMessageInDb
    await pubSub.publish('MESSAGE_NOTIFICATION', { id, author, createdAt, content, mainPicture })
    return newMessageInDb
  }

  @Subscription({ topics: 'MESSAGE_NOTIFICATION' })
  messageSent(@Root() payload: Messages): Messages {
    console.log('insubscription', payload)
    // const { id, author, mainPicture, content, createdAt } = payload.Messages.payLoad
    return payload
  }

  // @Mutation(() => String, { name: 'deletePosts' })
  // async deletePosts(@Arg('id') id: string): Promise<String> {
  //   const result = await PostsModel.deleteOne({ _id: id })

  //   if (result.ok == 1) return id
  //   else return ''
  // }

  // @Mutation(() => String, { name: 'addLikes' })
  // async addLike(@PubSub() pubSub: PubSubEngine, @Arg('id') id: string): Promise<string> {
  //   const result = await PostsModel.findByIdAndUpdate(
  //     { _id: id },
  //     { $inc: { likes: 1 } },
  //     { new: true },
  //   )
  //   console.log('result', result)
  //   const payload = result.likes
  //   await pubSub.publish(channel, payload)
  //   return result.likes
  // }

  // @Subscription({ topics: channel })
  // likeAdded(
  //   @Root()
  //   {
  //     id,
  //     title,
  //     intro,
  //     author,
  //     mainPicture,
  //     content,
  //     createdAt,
  //     validated,
  //     submitted,
  //     comments,
  //     likes,
  //   }: Posts,
  // ): Posts {
  //   return {
  //     id,
  //     title,
  //     intro,
  //     author,
  //     mainPicture,
  //     content,
  //     createdAt,
  //     validated,
  //     submitted,
  //     comments,
  //     likes,
  //   }
  // }
}
