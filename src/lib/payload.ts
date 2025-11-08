import configPromise from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'

export const getPayload = async () => getPayloadInstance({ config: await configPromise })