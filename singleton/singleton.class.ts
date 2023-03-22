class Singleton{

private static instance:Singleton;

private constructor(){}

public static getInstance(){
    if(!Singleton.instance){
        Singleton.instance = new Singleton();
    }
    return Singleton.instance;
}
    myMethod(){
        console.log("hola mundo");
        
    }

    suma(a:number,b:number){
        return a+b
    }
}
const myclass1 = Singleton.getInstance();
const MyClass = Singleton.getInstance();


MyClass.myMethod()

myclass1.suma(5,1)


const MyClass1 = Singleton.getInstance();
MyClass.suma(1,2)


class Pokemon{

    pokemonFuego(){
    

    }
    pokemonAgua(){
    console.log("zzzzz");

    }
    pokemonTierra(){
        let pasos
        if(pasos==100){
            console.log("hoy caminaste mucho");
            
        }
    }
}

