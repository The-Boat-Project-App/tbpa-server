import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { PartnersModel, Partners } from '../models/partners.model'
// import { Location } from '../models/trips/location'
import { PartnerInput } from './types/partners.input'
import { sign } from 'jsonwebtoken'
import { MyContext } from './MyContext'
import { createAccessToken, createRefreshToken } from './auth'
import { isAuth } from './isAuth'
import { sendRefreshToken } from './sendRefreshToken'

@Resolver((_of) => Partners)
export class PartnerResolver {
  @Query((_returns) => Partners, { nullable: false, name: 'Partner' })
  async getPartnerById(@Arg('id') id: string) {
    console.log('dans resolver getPartnerbyid')
    const partnerData = await PartnersModel.findById({ _id: id })
    return partnerData
  }
  @Query(() => [Partners], { name: 'PartnersList', description: 'Get List of Partners' })
  async getAllPartners() {
    return await PartnersModel.find()
  }
}
