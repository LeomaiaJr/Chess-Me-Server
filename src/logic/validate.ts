import * as yup from 'yup';

export const movementSchema = yup.object().shape({
  move: yup.object().shape({
    from: yup.string().required(),
    to: yup.string().required(),
  }),
  playerName: yup.string().required(),
  leosSecret: yup.string().optional(),
});
