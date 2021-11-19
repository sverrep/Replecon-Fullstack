import React from 'react';
import getIP from './settings.js'

describe('Correct IP', ()=>{
    it('should use the correct IP', ()=>{
        const result = getIP()
        expect(result).toBe("https://mythical-mason-324813.ey.r.appspot.com/")
    })
    

})