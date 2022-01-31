import AWS from 'aws-sdk';
import { pgRunQuery } from "@libs/pg";
import { IProduct } from "@utils/intefaces";
import { formatJSONResponse } from "@libs/apiGateway";

const { SNS_ARN } = process.env;

export async function handler(event) {
  const sns = new AWS.SNS();

  try {
    for (const record of event.Records) {
      const { title, description, price } = JSON.parse(record.body);

      const query = `
      INSERT INTO products(title, description, price)
      VALUES($1, $2, $3)
      RETURNING *
    `;
      const values = [ title, description, price ];

      await pgRunQuery<Array<IProduct>, string | number>(query, values);
    }

    await sns.publish({
      Subject: 'Загрузка данных прошла успешно',
      Message: JSON.stringify(event.Records.map((record) => record.body)),
      TopicArn: SNS_ARN
    }, (error) => {
      if (error) {
        throw error;
      }
    }).promise();

    return formatJSONResponse('');
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
}