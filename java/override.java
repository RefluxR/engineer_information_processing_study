public class override{
    public static void main(String[] args) {
        new chiled();   // chiled 클래스의 생성자를 호출하면 상위 클래스부터 생성자가 호출됨
       
        // 이 과정에서 parent 클래스의 func()가 호출되고, 그 다음에 chiled 클래스의 func()가 호출됨    
        // 객체를 생성하기만해도 내부의 연산이 이루어짐  
        System.out.println(parent.total);
    }
}

class parent {
    static int total = 0; 

    int v = 1;
    parent() {  // 생성자 함수를 호출할 때마다 v가 1씩 증가함
        total += (++v);
        func();  // chiled.func()가 호출됨
    }

    void func() {  // 하위 클래스에서 정의된 Override된 매서드가 호출됨
        total += total; // 따라서 해당 코드는 하위 클래스의 func()가 호출되어 total을 두 배로 증가시킴
    }
}

class chiled extends parent {
    int v = 10; // 부모 클래스의 v와는 다른 변수

    chiled() {  
        v += 2;
        total += (v++);
        func();
    }

    @Override
    void func() {
        total += total * 2;
    }
}

