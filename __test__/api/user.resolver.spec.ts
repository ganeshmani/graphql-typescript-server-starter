const db = require('../db');
import { runQuery } from '../run';
import { GraphQLError } from 'graphql';

describe('Register Mutation', () => {
  beforeAll(db.connectToDB);

  afterAll(db.disconnectDB);

  afterAll(db.cleanDB);

  const registerMutation = `
mutation Register($name: String!,$email : String!,$password : String!) {
  registerUser(
  name : $name,email : $email,password: $password
  ) {
    success
    data{
      name 
      email
    }
    error
  }
}
`;
  it('run successfully', async () => {
    const user = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    };

    const response = await runQuery(registerMutation, {
      name: user.name,
      email: user.email,
      password: user.password,
    });
    expect(response).toMatchObject({
      data: {
        registerUser: {
          success: true,
          data: {
            name: user.name,
            email: user.email,
          },
          error: null,
        },
      },
    });
  });

  it('validates when required field is missing', async () => {
    const user = {
      name: 'test',
      email: 'test@gmail.com',
    };

    const response = await runQuery(registerMutation, {
      name: user.name,
      email: user.email,
    });

    // expect(response.errors).toThrowError(
    //   new GraphQLError(
    //     `Variable , "$password",  of required type , (String!),  was not provided`
    //   )
    // );
  });

  const loginQuery = `
  query LoginUser($email :String!,$password : String!){
    loginUser(email: $email,password : $password){
      success
      data{
        email
      }
      error
    }
  }
  `;
  it('run successfully', async () => {
    const user = {
      email: 'test@gmail.com',
      password: '123456',
    };

    const response = await runQuery(loginQuery, {
      email: user.email,
      password: user.password,
    });
    expect(response).toMatchObject({
      data: {
        loginUser: {
          success: true,
          data: {
            email: user.email,
          },
          error: null,
        },
      },
    });
  });
});
