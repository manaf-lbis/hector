import ApiError from "../utility/api.error";

export const errorHandler = (err: any, req: any, res: any, next: any) => {

      console.error(err.stack); 

        if (err instanceof ApiError) {
            res.status(err.statusCode).json({
                success: err.success,
                message: err.message,
                error: err.error
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: null
            });
        }

}


export default errorHandler;