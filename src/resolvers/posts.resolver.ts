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
} from 'type-graphql'
import { PostsModel, Posts } from '../models/posts.model'
import { Users } from '../models/users.model'
import { PostsInput } from './types/posts-input'
import { MyContext } from './MyContext'

import { isAuth } from './isAuth'

const channel = 'LIKES_CHANNEL'

@Resolver((_of) => Posts)
export class PostsResolver {
  @Query((_returns) => Posts, { nullable: false, name: 'Posts' })
  async getPostsById(@Arg('id') id: string) {
    const postData = await PostsModel.findById({ _id: id })
      .populate({ path: 'author', model: Users })
      .exec()
    console.log('✏️🧡postDnata dans resolver', postData)

    return postData
  }

  @Query(() => [Posts], { name: 'PostsList', description: 'Get List of Posts' })
  async getAllPosts() {
    return await PostsModel.find()
  }

  @Query(() => [Posts], { name: 'ValidatedPostsList', description: 'Get List of Validated Posts' })
  async getValidatedPosts() {
    console.log('dans resolver getValidatedPosts')
    return await PostsModel.find({ validated: 'validated' })
  }

  @Query(() => [Posts], { name: 'PostsByUserList', description: 'Get List of Posts By User' })
  async getPostsByUser(@Arg('id') id: string) {
    console.log('id from front', id)
    const foundPosts = await PostsModel.find({ author: id, validated: 'validated' })
    console.log(foundPosts)
    return foundPosts
  }
  // get all draft posts
  @Query(() => [Posts], {
    name: 'AllDraftPostsByUserList',
    description: 'Get List of All Draft Posts By User',
  })
  @UseMiddleware(isAuth)
  async getAllDraftPostsByUser(@Ctx() { payload }: MyContext) {
    const draftPosts = await PostsModel.find({ author: payload.userId, submitted: false })
    console.log('foundPosts', draftPosts)
    return draftPosts
  }
  // get all submitted posts
  @Query(() => [Posts], {
    name: 'AllSubmittedPostsByUserList',
    description: 'Get List of All Submitted Posts By User',
  })
  @UseMiddleware(isAuth)
  async getAllSubmittedPostsByUser(@Ctx() { payload }: MyContext) {
    const submittedPosts = await PostsModel.find({ author: payload.userId, submitted: true })
    console.log('submittedPosts', submittedPosts)
    return submittedPosts
  }

  @Query(() => [Posts], {
    name: 'AllPostsByUserList',
    description: 'Get List of All Posts By User',
  })
  @UseMiddleware(isAuth)
  async getAllPostsByUser(@Ctx() { payload }: MyContext) {
    const foundPosts = await PostsModel.find({ author: payload.userId })
    console.log('foundPosts', foundPosts)
    return foundPosts
  }

  @Mutation(() => Posts, { name: 'createPosts' })
  @UseMiddleware(isAuth)
  async createPosts(
    @Arg('newPostsInput')
    { id, title, intro, content, mainPicture, likes, submitted, validated, video }: PostsInput,
    @Ctx() { payload }: MyContext,
  ): Promise<Posts> {
    console.log('infos qui arrivent dans createPost resolver', {
      id,
      title,
      intro,
      content,
      mainPicture,
      likes,
      submitted,
      validated,
      video,
    })
    if (id !== 'error') {
      const existingPost = await PostsModel.findOne({ _id: id })
      console.log('existing Post', existingPost)
      if (!existingPost) {
        const Posts = (
          await PostsModel.create({
            title,
            intro,
            content,
            author: payload.userId,
            mainPicture,
            likes,
            submitted,
            validated,
            video,
          })
        ).save()
        return Posts
      }
    } else {
      const Posts = await PostsModel.findByIdAndUpdate(
        { _id: id },
        {
          title,
          intro,
          content,
          mainPicture,
          likes,
          submitted,
          validated,
          video,
        },
      )
      return Posts
    }
  }

  @Mutation(() => Posts, { name: 'updatePost' })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('newPostsInput')
    { id, title, intro, content, mainPicture, likes, submitted, validated, video }: PostsInput,
    @Ctx() { payload }: MyContext,
  ): Promise<Posts> {
    console.log('infos qui arrivent dans updatePost resolver', {
      id,
      title,
      intro,
      content,
      mainPicture,
      likes,
      submitted,
      validated,
      video,
    })
    const Posts = await PostsModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        intro,
        content,
        mainPicture,
        likes,
        submitted,
        validated,
        video,
      },
    )
    return Posts
  }

  // @Mutation(() => Posts, { name: 'updatePosts' })
  // async updatePosts(@Arg('editPostsInput') { id }: PostsInput): Promise<Posts> {
  //   const Posts = await PostsModel.findByIdAndUpdate(
  //     { _id: id },
  //     { $inc: { likes: 1 } },
  //     { new: true },
  //   )

  //   return Posts
  // }

  @Mutation(() => String, { name: 'deletePosts' })
  async deletePosts(@Arg('id') id: string): Promise<String> {
    const result = await PostsModel.deleteOne({ _id: id })

    if (result.ok == 1) return id
    else return ''
  }

  @Mutation(() => String, { name: 'addLikes' })
  async addLike(@PubSub() pubSub: PubSubEngine, @Arg('id') id: string): Promise<string> {
    const result = await PostsModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { likes: 1 } },
      { new: true },
    )
    console.log('result', result)
    const payload = result.likes
    await pubSub.publish(channel, payload)
    return result.likes
  }

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
