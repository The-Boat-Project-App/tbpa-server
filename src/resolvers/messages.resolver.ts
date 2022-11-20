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
import { Users, UsersModel } from '../models/users.model'
import { MessagesInput } from './types/messages-input'
import { MyContext } from './MyContext'

import { isAuth } from './isAuth'

@Resolver((_of) => Messages)
export class MessagesResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Messages], { name: 'MessagesList', description: 'Get List of Messages' })
  async getAllMessages(@PubSub() pubSub: PubSubEngine, @Ctx() { payload }: MyContext) {
    console.log('resolver getallmessages')
    console.log('payload ctx', payload)
    const newUserConnected = await UsersModel.findOne({ _id: payload.userId })
    const allMessagesInDb = await MessagesModel.find()
      .populate({ path: 'author', model: Users })
      .exec()
    // console.log('allMessagesInDb', allMessagesInDb)
    console.log('newuserconnected envoyé dans le payload', newUserConnected)
    const { lang, tokenVersion, id, firstName, lastName, email, password, avatar, status } =
      newUserConnected
    await pubSub.publish('USER_CONNECTED_NOTIFICATION', {
      lang,
      tokenVersion,
      id,
      firstName,
      lastName,
      email,
      password,
      avatar,
      status,
    })

    return allMessagesInDb
  }

  @Subscription({ topics: 'USER_CONNECTED_NOTIFICATION' })
  newUserConnected(@Root() payload: Users): Users {
    console.log('sub newuserconnected', payload)
    // const { id, author, mainPicture, content, createdAt } = payload.Messages.payLoad
    return payload
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
    // const { id, author, mainPicture, content, createdAt } = payload.Messages.payLoad
    return payload
  }
  //   @Query(() => String, { name: 'usersConnectedToChat' })
  //   async usersConnectedToChat(
  //     @PubSub() pubSub: PubSubEngine,
  //     @Ctx() { payload }: MyContext,
  //   ): Promise<String> {
  //     const result = await UsersModel.deleteOne({ _id: payload.userId })
  //     await pubSub.publish('USER_CONNECTED_NOTIFICATION', {
  //       id,
  //       author,
  //       createdAt,
  //       content,
  //       mainPicture,
  //     })

  //     return id
  //   }

  //!
}
