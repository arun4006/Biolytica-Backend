const express=require('express');
const router= new express.Router();
const authService=require('../../services/auth/authServices')
const cognitoService=require('../../services/cognito/getUserService')


router.get("/login", authService.login);
    
router.get("/api-auth/auth",authService.generateToken);

router.get('/auth/getuser/:userId',cognitoService.getUserService)
  
router.get("/logout", authService.logout)

module.exports= router ;