export const handler = async (event, context) => {
    return {
      body: JSON.stringify({ message: "Hello World" }),
      statusCode: 200
    };
  };
  