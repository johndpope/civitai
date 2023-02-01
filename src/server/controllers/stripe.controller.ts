import { throwAuthorizationError, throwNotFoundError } from '~/server/utils/errorHandling';
import {
  createCustomer,
  createSubscribeSession,
  createManageSubscriptionSession,
} from './../services/stripe.service';
import { Context } from '~/server/createContext';
import * as Schema from '../schema/stripe.schema';

import { getPlans } from '~/server/services/stripe.service';

export const getPlansHandler = async () => {
  return await getPlans();
};

export const createCustomerHandler = async ({
  input,
  ctx,
}: {
  input: Schema.CreateCustomerInput;
  ctx: DeepNonNullable<Context>;
}) => {
  return await createCustomer({ ...input });
};

export const createSubscriptionSessionHandler = async ({
  input: { priceId },
  ctx,
}: {
  input: Schema.CreateSubscribeSessionInput;
  ctx: DeepNonNullable<Context>;
}) => {
  const { id, email, customerId } = ctx.user;
  if (!email) throw throwAuthorizationError('email required');
  return await createSubscribeSession({
    priceId,
    customerId,
    user: { id, email },
  });
};

export const createManageSubscriptionSessionHandler = async ({
  ctx,
}: {
  ctx: DeepNonNullable<Context>;
}) => {
  if (!ctx.user.customerId) throw throwNotFoundError('customerId not found');
  return await createManageSubscriptionSession({ customerId: ctx.user.customerId });
};
