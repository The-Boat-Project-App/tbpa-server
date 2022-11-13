import { Ref } from '@typegoose/typegoose'
import { Field, InputType, ID } from 'type-graphql'
import { Boat } from '../../models/trips/boat'
import { Partners, PartnersModel } from '../../models/partners.model'

@InputType()
class Intro {
  @Field(() => String)
  EN: string

  @Field(() => String)
  FR: string

  @Field(() => String)
  ES: string

  @Field(() => String)
  IT: string

  @Field(() => String)
  AR: string
}

@InputType()
class Content {
  @Field(() => String)
  EN: string

  @Field(() => String)
  FR: string

  @Field(() => String)
  ES: string

  @Field(() => String)
  IT: string

  @Field(() => String)
  AR: string
}

@InputType()
class Name {
  @Field(() => String)
  EN: string

  @Field(() => String)
  FR: string

  @Field(() => String)
  ES: string

  @Field(() => String)
  IT: string

  @Field(() => String)
  AR: string
}

@InputType()
export class PartnerInput implements Partial<Partners> {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  main_picture: string

  @Field({ nullable: true })
  logo: string

  @Field({ nullable: true })
  address: string

  @Field({ nullable: true })
  city: string

  @Field({ nullable: true })
  country: string

  @Field(() => Number)
  latitude: number

  @Field(() => Number)
  longitude: number

  @Field({ nullable: true })
  website: string

  @Field()
  createdAt: Date

  @Field(() => Intro)
  intro: Intro

  @Field(() => Name)
  name: Name

  @Field(() => Content)
  content: Content
}
