#include <stdio.h>

int main() {
	int a = 11;
	int b = 19;
	switch(a) {
		case 1:
			b += 1;
		case 11:
			b += 2;
        case 12:
            b += 4;
		default:
			b += 3;
			break;
	}
	printf("%d", a-b);
}