import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from 'type-graphql'
import { TripModel, Trip, Location } from '../models/trips/trip.model'
import { Boat } from '../models/trips/boat'
// import { Location } from '../models/trips/location'
import { getCoordinate } from '../puppeteer/index'
import { TripInput } from './types/trip-input'
import { sign } from 'jsonwebtoken'
import { MyContext } from './MyContext'
import { createAccessToken, createRefreshToken } from './auth'
import { isAuth } from './isAuth'
import { sendRefreshToken } from './sendRefreshToken'

@Resolver((_of) => Trip)
export class TripResolver {
  @Query((_returns) => Trip, { nullable: false, name: 'Trip' })
  async getTripById(@Arg('id') id: string) {
    console.log('dans resolver getTripbyid')
    const tripData = await TripModel.findById({ _id: id })
    const formattedTripData = {
      id: tripData._id,
      start_date: tripData.start_date,
      locations: [
        {
          name: tripData.locations[tripData.locations.length - 1].name,
          latitude: tripData.locations[tripData.locations.length - 1].latitude,
          longitude: tripData.locations[tripData.locations.length - 1].longitude,
          date: tripData.locations[tripData.locations.length - 1].date,
          description: tripData.locations[tripData.locations.length - 1].date,
        },
      ],
    }
    return formattedTripData
  }

  @Mutation(() => Trip, { name: 'updateTrip' })
  async updateTrips(): Promise<Trip> {
    const coords = await getCoordinate()
    console.log('coords', coords)
    const updatedTrip = await TripModel.updateOne(
      { _id: '63627a16ad3d7a6d9999e8e9' },
      {
        $push: {
          locations: {
            latitude: Number(coords.coords[0]),
            longitude: Number(coords.coords[1]),
            date: new Date(),
            name: coords.currentPort,
            description: 'description',
          },
        },
      },
      { new: true },
    )
    const refreshedTrip = await TripModel.findOne({
      _id: '63627a16ad3d7a6d9999e8e9',
    })
    console.log('refreshedTrip', refreshedTrip)
    return refreshedTrip
  }
}
