class Printer {
    void print(Integer a) {
        System.out.print("A" + a);
    }
    void print(Object a) {
        System.out.print("B" + a); 
        // 자바의 오버로드된 메서드 선택 방식
        // object 
    }
    void print(Number a) {
        System.out.print("C" + a);
    }
}

public class generic {
    public static void main(String[] args) {
        new Container<>(0).print(); // 0을 제네릭 타입으로 전달
    }

    public static class Container<T> { // 제네릭 타입 추가
        T value;

        public Container(T t) {
            value = t;
        }

        public void print() {
            new Printer().print( value); // 타입추론에 의해 value의 타입이 결정됨
        }
    }
}
