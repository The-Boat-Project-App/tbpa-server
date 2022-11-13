import { prop as Property, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose'
import { Field, ObjectType, ID } from 'type-graphql'

@ObjectType('introObject')
export class Intro {
  @Field(() => String)
  @Property({ type: () => String })
  EN: string

  @Field(() => String)
  @Property({ type: () => String })
  FR: string

  @Field(() => String)
  @Property({ type: () => String })
  ES: string

  @Field(() => String)
  @Property({ type: () => String })
  IT: string

  @Field(() => String)
  @Property({ type: () => String })
  AR: string
}

@ObjectType('contentObject')
export class Content {
  @Field(() => String)
  @Property({ type: () => String })
  EN: string

  @Field(() => String)
  @Property({ type: () => String })
  FR: string

  @Field(() => String)
  @Property({ type: () => String })
  ES: string

  @Field(() => String)
  @Property({ type: () => String })
  IT: string

  @Field(() => String)
  @Property({ type: () => String })
  AR: string
}

@ObjectType('nameObject')
export class Name {
  @Field(() => String)
  @Property({ type: () => String })
  EN: string

  @Field(() => String)
  @Property({ type: () => String })
  FR: string

  @Field(() => String)
  @Property({ type: () => String })
  ES: string

  @Field(() => String)
  @Property({ type: () => String })
  IT: string

  @Field(() => String)
  @Property({ type: () => String })
  AR: string
}

@ObjectType({ description: 'The Partners Model' })
@modelOptions({ schemaOptions: { collection: 'partners', timestamps: true } })
export class Partners {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  main_picture: string

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  logo: string

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  address: string

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  city: string

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  country: string

  @Field(() => Number)
  @Property({ type: () => Number, required: false })
  latitude: number

  @Field(() => Number)
  @Property({ type: () => Number, required: false })
  longitude: number

  @Field({ nullable: true })
  @Property({ type: () => String, required: false })
  website: string

  @Field()
  @Property({ required: true, default: Date.now })
  createdAt: Date

  @Field(() => Intro)
  @Property({ type: () => Intro })
  intro: Intro

  @Field(() => Name)
  @Property({ type: () => Name })
  name: Name

  @Field(() => Content)
  @Property({ type: () => Content })
  content: Content
}

export const PartnersModel = getModelForClass(Partners)
