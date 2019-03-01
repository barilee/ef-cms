import jwt from 'jsonwebtoken';

export const decodeTokenAction = ({ props }) => {
  const decoded = jwt.decode(props.token);
  decoded.userId = decoded.email;
  decoded.role = decoded['custom:role'];
  return {
    token: props.token,
    user: decoded,
  };
};
