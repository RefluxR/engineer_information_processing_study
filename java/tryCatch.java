public class tryCatch {
	public static void main(String[] args) {
		int sum = 0;
		try { 
			func();
		} catch(NullPointerException e) {
			sum = sum + 1;
		} catch(Exception e) {
			// NullPointerException이 아닌 다른 예외가 발생했을 때 처리
			// Exception은 예외의 "최상위 클래스"
			sum = sum + 10;
		} finally {
			sum = sum + 100;
		}
		System.out.print(sum);
	}
	static void func() throws Exception {
		                 // 예외를 호출한 곳에서 처리
		// 예외를 발생
		throw new NullPointerException();
	}
}
