import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//function to cheak if password is correct or not
const isPasswordCorrect=async function(password) {
    return await bcrypt.compare(password,this.password)
}

//to generate accesstoken
const generateAccessToken = async function () {
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    )
}

//to generate refreshtoken
const generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY || '7d'
        }
    )
}

export {
    isPasswordCorrect,
    generateAccessToken,
    generateRefreshToken
}