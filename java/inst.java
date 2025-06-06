class Connection {
 
    private static Connection _inst = null; // 객체 참조 변수
    private int count = 0;
    
    static public Connection get() {
        if(_inst == null) {
            _inst = new Connection();
            return _inst;
        }
        return _inst;
    }
    
    public void count() {
         count++; 
    }
    
    public int getCount() {
         return count; 
    }
}


 
public class inst {  
 
    public static void main(String[] args) {
        
        // 존나 중요하다ㅣ!!!!! 꼮 봐라 !!!!!!
        // 생글톤 패턴으로 인스턴스 시킨 conn1 conn2 coon3는 모두 같은 인스턴스를 가르킨다  
        // 따라서 conn1.count()를 호출하면 conn1, conn2, conn3 모두 같은 인스턴스의 count가 증가한다.

        Connection conn1 = Connection.get();
        conn1.count();
 
        Connection conn2 = Connection.get();
        conn2.count();
 
        Connection conn3 = Connection.get();
        conn3.count();
        
        conn1.count();
        System.out.print(conn1.getCount());
    }

     
 
}