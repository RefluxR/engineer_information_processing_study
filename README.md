# engineer_information_processing_study
Storage for codespaces for information processor hands-on practice <br>
(sql execution statement, python, java, c)

git hub에 이런 ide가 있으면 노트북 굳이 필요없지 ㅋㅋㅋ<br>
그냥 싸지방 와서 계속 파다보면 그래도 나름 개발 실력 올라갈 듯

이거도 commit하면 공유 될 텐데...<br>
정보처리기사 실기까지 야무지게 따고<br>
유능한 개발자 될 때까지 노력하겠습니다.

## my sql 서버 실행하는 방법

1. 실행여부 확인

```bash
sudo service mysql status
```

2. 실행 & 종료
```bash
sudo service mysql start(stop : 종료)
```

3. 127.0.0.1:3306 (주소:포트번호) 수신 대기 확인
```bash
sudo netstat -tlnp | grep 3306
```

4. 클라이언트 확인

```bash
mysql -u root -p -h 127.0.0.1 -P 3306
```

5. mysql.sock또는 bind-address 문제 확인

```
/etc/mysql/mysql.conf.d/mysqld.cnf
``` 

* bind-address가 ::1이거나 외부주소(0.0.0.0)이면 127.0.0.1로 변경

    -> 변경 후 sudo service mysql restart

### 만약 
```
___ ➜ /workspaces/engineer_information_processing_study (main) $ mysql -h 127.0.0.1 -P 3306 -u root -p'1234' --ssl-mode=DISABLED
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1698 (28000): Access denied for user 'root'@'localhost'
```
이라고 뜨면

``` sql
sudo mysql

mysql > 
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;
```

- 인증방식을 auth-socket -> mysql_native_password로 변경
- 비밀번호는 임의로 설정

> root 계정이 비밀번호 기반 로그인이 아니라
"UNIX socket 인증" 이다 (auto_socket plugin)
