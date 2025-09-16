class ApiResponce{
    constructor(
        statusCode,
        message='successs',
        data
    ){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success=statusCode<400
    }
}

export {ApiResponce}