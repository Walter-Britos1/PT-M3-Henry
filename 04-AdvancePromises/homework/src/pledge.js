'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
    this._state = 'pending';
    this._value = undefined;
    this._handlerGroups = [];
    if (typeof executor !== "function") throw new TypeError("executor is not a function");
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))
}

$Promise.prototype._internalResolve = function(value){
    if (this._state == 'pending'){ 
        this._state = "fulfilled";
        this._value = value;
        this._callHandlers();
    }
}

$Promise.prototype._internalReject = function(value){
    if (this._state == 'pending'){ 
        this._state = "rejected";
        this._value = value;
        this._callHandlers();
    }
}

$Promise.prototype._callHandlers = function(){
    while (this._handlerGroups.length > 0) {
        //toma primer objeto del arreglo
        const cb = this._handlerGroups.shift();
        if (this._state === 'fulfilled') {
            if (cb.successCb) {
                try {
                    //guardamos la resolucion del CB
                    const result = cb.successCb(this._value);
                    //asegurarnos que una nueva promesa se retorno
                    if (result instanceof $Promise) {
                        return result.then(
                            //CB resolve
                            (value) =>{
                                return cb.downstreamPromise._internalResolve(value);
                            },
                            //CB Reject
                            (error) =>{
                                return cb.downstreamPromise._internalReject(error);
                            }
                        );
                    }else{ //si no es un promesa nueva
                        cb.downstreamPromise._internalResolve(result);
                    }
                } catch (error) {
                    cb.downstreamPromise._internalReject(error)
                }
            }else{
                return cb.downstreamPromise._internalResolve(this._value)
            }
        }else if (this._state === 'rejected') {
            if (cb.errorCb) {
                try {
                    //guardamos la resolucion del CB
                    const result = cb.errorCb(this._value);
                    //asegurarnos que una nueva promesa se retorno
                    if (result instanceof $Promise) {
                        return result.then(
                            //CB resolve
                            (value) =>{
                                return cb.downstreamPromise._internalResolve(value);
                            },
                            //CB Reject
                            (error) =>{
                                return cb.downstreamPromise._internalReject(error);
                            }
                        );
                    }else{ //si no es un promesa nueva
                        cb.downstreamPromise._internalResolve(result);
                    }
                } catch (error) {
                    cb.downstreamPromise._internalReject(error)
                }
            }else{
                return cb.downstreamPromise._internalReject(this._value)
            }
        }
    }
}

$Promise.prototype.then = function(successCb, errorCb){
    if (typeof successCb !== 'function') successCb = false;
    if (typeof errorCb !== 'function') errorCb = false;

    const downstreamPromise  = new $Promise(()=>{});

    this._handlerGroups.push({
        successCb,
        errorCb,
        downstreamPromise 
    });

    //Si el estado ya se resolvio
    if (this._state !== 'pending') this._callHandlers();
    return downstreamPromise ;
}

$Promise.prototype.catch = function(errorCb){
    return this.then(null, errorCb);
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
