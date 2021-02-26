const { v4: uuidv4 } = require('uuid');
const atob = require('atob');
import { PubSub } from '@google-cloud/pubsub';
import { CloudSpannerClient } from './utils/cloudSpannerClient';
import { projectId, instanceId, databaseName, topicName } from './config/config';
import { 
  allowedProperties, 
  defaultUserStatus, 
  usersTableName, 
  defaultUserName,
  maxPropLength 
} from './constants/const';
import { IUser } from './interfaces/user.interface';

export const pubsub = async (message: any): Promise<void> => {

  const base64DataString: string | boolean = message && message?.data;

  if (!base64DataString) { 
    return console.log('Message is empty');
  }

  const dataString = atob(base64DataString);

  let messageObj: object;
  
  try {
    messageObj = JSON.parse(dataString);
  } catch (error) {
    return console.log(`Message is not valid JSON (${error.message})`);
  }

  const isValidUser = Object.entries(messageObj).every(
    ([key, value]) => allowedProperties.includes(key) && value && value.length <= maxPropLength 
  );

  if (!isValidUser || !Object.keys(messageObj).length) { 
    return console.log('User object is invalid');
  }

  // if data is valid send to cloud spanner
  const cloudSpannerClient = new CloudSpannerClient(projectId, instanceId, databaseName);

  const user: IUser = Object.assign(
    { 
      userId: uuidv4(),
      firstName: defaultUserName,
      status: defaultUserStatus
    },
    messageObj
  );

  try {
    const response = await cloudSpannerClient.insertData(usersTableName, user);
    await sendPubSubResponse(response);
  } catch (error) {
    return console.log(
      `En error occured when CloudSpannerClient tried 
      to insert data to Cloud Spanner (${error.message})`
    );
  }
};

const sendPubSubResponse = async (data: any): Promise<void> => {
  const pubsub = new PubSub();
  const topic = pubsub.topic(topicName);

  const messageObj = {
    data: {
      message: data
    }
  };

  const messageBuffer = Buffer.from(JSON.stringify(messageObj), 'utf8');

  try {
    await topic.publish(messageBuffer);
  } catch (error) {
    console.log(`Unable to send PubSub response (${error.message})`);
  }
}