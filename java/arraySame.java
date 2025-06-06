public class arraySame {
	public static void check(int[] x, int[] y) {
		if(x==y) System.out.print("O");
		// x == y 를 비교하면 배열의 내용을 비교하는 것이 아님.
		// 배열의 참조값(주소)를 비교하게 됨

		// 그러나 (python)에서는 x == y 를 사용하면
		// 배열의 내용을 비교하게 됨.
		// x is y 는 배열의 참조값(주소)를 비교하게 됨
		else System.out.print("N");
	}


	public static void main(String[] args) {
		int a[] = new int[] {1, 2, 3, 4};
		int b[] = new int[] {1, 2, 3, 4};
		int c[] = new int[] {1, 2, 3};
		check(a, b);
		check(b, c);
		check(a, c);

		System.out.println("\n equals() 메서드로 비교");

		System.out.println(a.equals(b)); // false
		System.out.println(b.equals(c)); // false
		System.out.println(a.equals(c)); // false

		System.out.println("Arrays.equals() 메서드로 비교");
		System.out.println(java.util.Arrays.equals(a, b));	

	}
    
}

