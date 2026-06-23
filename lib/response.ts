export default class Response {
  static success(
    message: string = "Success",
    statusCode = 200,
    data?: object | null | unknown,
  ) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }
  static error(
    message: string = "Error",
    statusCode = 500,
    data?: object | null | unknown,
  ) {
    return {
      success: false,
      statusCode,
      message,
      data,
    };
  }
}
