const express=require('express');
const router= new express.Router();
const authService=require('../../services/auth/authServices')


router.get("/login", authService.login);
    
router.get("/api-auth/auth",authService.generateToken);
  
router.get("/logout", authService.logout)

module.exports= router ;