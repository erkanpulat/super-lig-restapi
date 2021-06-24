# Node.js - MongoDB MVC REST API - Süper Lig 2020-2021 Sezonu 

## Proje Görselleri Ve Açıklaması

-  ### Kullanılan Paketler
    ```
    +-- axios@0.21.1
    +-- cheerio@1.0.0-rc.10
    +-- express@4.17.1
    `-- mongoose@5.12.14
    ```
 - Projede kullanılacak veriler `util/getData.js` dosyasındaki fonksiyonlar ile çekilmektedir. İlgili fonksiyonun 1 kere çağrılması verilerin kaydedilmesi için yeterlidir.  (`app.js` içinde yorum satırındadır) **Uygulama örnek amaçlıdır, sitelerden veri almak yasal sorunlara sebep olabilir.**
 
 - ### Rotalar
    - ```
      http://localhost:3000
      ```
      ![image](https://user-images.githubusercontent.com/65369334/122657927-548cfb80-d170-11eb-82dd-f7ab303b1861.png)

    - ### Takımlar
      **Tüm takımlar listelenir. (21 Takım)**
      ```
      http://localhost:3000/team
      ```
      ![image](https://user-images.githubusercontent.com/65369334/122658152-80a97c00-d172-11eb-96ef-fdf8c3c1fdc2.png)

      **Takım isimlerine göre A'dan Z'ye artan olarak veya tam tersi olarak listelenir.**
       ```
       http://localhost:3000/team?sort=increase
       http://localhost:3000/team?sort=decrease
       ```

       **Takım dokümanı içinde bulunan `teamLink` alanına göre ilgili takımı getirir.**
       ```
       http://localhost:3000/team/fenerbahce
       ```
       ![image](https://user-images.githubusercontent.com/65369334/122658176-e990f400-d172-11eb-88a7-39e3adb4b4f7.png)

       **Hatalı giriş!**
       ```
       http://localhost:3000/team/erkan
       ```
       ![image](https://user-images.githubusercontent.com/65369334/122658185-f9103d00-d172-11eb-9e71-a71e42127df5.png)
       
    - ### Maçlar
    
      **Tüm maçlar listelenir. (420 Maç)**
      ```
      http://localhost:3000/match
      ```
      ![image](https://user-images.githubusercontent.com/65369334/122658210-2f4dbc80-d173-11eb-894b-a7a318392b31.png)
      
      **Maçlar tarihine göre artan veya azalan şekilde listelenir.**
       ```
       http://localhost:3000/match?date=increase
       http://localhost:3000/match?date=decrease
       ```
       **Tarihine göre azalan şekilde sıralanmış 3 maçı tek getirir.**
       ```
       http://localhost:3000/match?date=decrease&limit=3
       ```
       **Rastgele 3 maçı getirir.**
       ```
       http://localhost:3000/match?random=3
       ```
     
    - ### Takıma Özel Maçlar
    
      **Takım dokümanı içinde bulunan `teamLink` alanına göre ilgili takımın maçlarını getirir. (40 Maç)**
      ```
      http://localhost:3000/match/fenerbahce
      ```
      ![image](https://user-images.githubusercontent.com/65369334/122656089-46cf7a00-d160-11eb-94a9-a7998fbcdad0.png)
      
      **İlgili takımın deplasmanda oynadığı veya kendi evinde oynadığı maçları getirir. (Yirmişer Maç)**
      ```
      http://localhost:3000/match/fenerbahce?cond=awayTeam
      http://localhost:3000/match/fenerbahce?cond=homeTeam
      ```
      **Deplasmanda oynadığı maçları tarihe göre azalan şekilde listeler.**
      ```
      http://localhost:3000/match/fenerbahce?cond=awayTeam&date=decrease
      ```
      **Kendi evinde oynadığı rastgele 2 maçı tarihe göre azalan şekilde listeler.**
      ```
      http://localhost:3000/match/fenerbahce?cond=homeTeam&date=decrease&random=2
      ```
      **Ev sahibi takımın en az 3 gol attığı maçları listeler.**
      ```
      http://localhost:3000/match/fenerbahce?homeTeamGoal=3
      ```
      **Deplasmandaki takımın en az 3 gol attığı maçları listeler.**
      ```
      http://localhost:3000/match/fenerbahce?awayTeamGoal=3
      ```
      **İlgili takımın kendi evinde gol attığı maçları listeler.**
      ```
      http://localhost:3000/match/fenerbahce?cond=homeTeam&homeTeamGoal=1
      ```
      **Hatalı Giriş!**
      ```
      http://localhost:3000/match/erkan
      ```
      ![image](https://user-images.githubusercontent.com/65369334/122658337-b0f21a00-d174-11eb-9981-1bab4755e1bc.png)
      
      **Hatalı Rota!**
      
      ![image](https://user-images.githubusercontent.com/65369334/122658341-bf403600-d174-11eb-8fcd-9861e21aca2e.png)
    

