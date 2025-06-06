

class B {
    int  x = 3;
    int getX() {
        return x*2;
    }
}

class A extends B {
    int x = 7;
    @Override
    int getX() { 
        return x * 3;
    }
}

//public class Annotation {
//    public static void main(String[] args){
//        B b1 = new A(); // 업스캐스팅 
//        A b2 = new A(); 

//        System.out.println(b1.getX() + b1.x +   
//                        b2.getX() + b2.x); 
//    }
//}



// 다형성은 인터페이스(interface)에서도 적용 가능
// 어떤 클래스가 특정 인터페이스를 구현했다면, 그 인터페이스 타입으로도 객체 선언

interface Animal {
    void makeSound();
}

class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

public class upcasting {
    public static void main(String[] args) {
        Animal a1 = new Dog();  // Animal 타입, 실제 객체는 Dog
        Animal a2 = new Cat();  // Animal 타입, 실제 객체는 Cat

        System.out.println("Animal a1 = new Dog();");
        System.out.println("Dog가 Animal을 구현");
        a1.makeSound();  // Woof!
        a2.makeSound();  // Meow!
    }
}

