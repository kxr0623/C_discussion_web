--create or open db: sqlite3 thedb
--run sql file: read .sql
--show dbs: .databases
--go into a db: .open Mydb
--show tables: .tables
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS Contact;
DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS Users;


CREATE TABLE Users(
uid INTEGER PRIMARY KEY AUTOINCREMENT,
username VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255)  NOT NULL,
email VARCHAR(255) NOT NULL
);
CREATE TABLE Topic(
tid INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
createtime DATETIME NOT NULL,
creator INTEGER NOT NULL,
description TEXT NOT NULL,
likes INTEGER NOT NULL,
code TEXT,
FOREIGN KEY (creator) REFERENCES Users(id)
);
CREATE TABLE Post(
pid INTEGER PRIMARY KEY AUTOINCREMENT,
code TEXT,
explain TEXT NOT NULL,
likes INTEGER NOT NULL,
createtime DATETIME NOT NULL,
creator INTEGER NOT NULL,
topicid INTEGER NOT NULL,
parent INTEGER NOT NULL,
FOREIGN KEY (creator) REFERENCES Users(id),
FOREIGN KEY (topicid) REFERENCES Topic(id)
);

CREATE TABLE Contact (
cid INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
createtime DATETIME NOT NULL,
creator TEXT NOT NULL,
email TEXT NOT NULL,
description TEXT NOT NULL
);


Insert into Users (username,password,email) values ("admin","111",'a@a.com');
Insert into Users (username,password,email) values ("thinkabout","111",'a@a.com');
Insert into Users (username,password,email) values ("algorithm","111",'a@a.com');
Insert into Users (username,password,email) values ("retanley","111",'a@a.com');
Insert into Users (username,password,email) values ("Salem","111",'a@a.com');

Insert into Users (username,password,email) values ("Lundin","111",'a@a.com');

Insert into Topic (title,createtime,creator,description,likes,code) values ('Strlen is return 1 on empty strings - fgets',datetime('now'),1,'My problem is strlen returns 1 on empty strings
If i write something like "a" it returns 1 too.

My final goal is to put one more condition on while
so the user can´t input empty strings.',65,'int size = 0;
 
do {
   puts("Insert the ID?");
   fgets(buffer.idarea, MAX, stdin);
   strtok(buffer.idarea, "\n"); // Consumir o \n
   printf("size of string %d\n", size = strlen(buffer.idarea));
} while (verifica_area_duplicadas(vector, *total, buffer.idarea) == 0);');
Insert into Topic (title,createtime,creator,description,likes,code) values ('How do I properly compare strings?',datetime('now'),6,'I am trying to get a program to let a user enter a word or character, 
store it, and then print it until the user types it again, exiting the program. 

The problem is that I keep getting the printing of the input string, 
even when the input by the user (check) matches the original (input). 

Am I comparing the two incorrectly? My code looks like this:',68,'#include <stdio.h>

int main()
{
    char input[40];
    char check[40];
    int i=0;
    printf("Hello!\nPlease enter a word or character:\n");
    gets(input);
    printf("I will now repeat this until you type it back to me.\n");

    while (check != input)
    {
        printf("%s\n", input);
        gets(check); 
    }

    printf("Good bye!");


    return 0;
}');
Insert into Post (likes,createtime,creator,topicid,parent,explain,code) 
values (66,datetime('now'),3,1,0,
   "strtok will not remove the newline (or any of the given separators) if there arent any non-separator characters in the string. 
   However, if there are no non-separator characters in the  string, strtok will return NULL, 
   so you can use that to tell if the line is empty. You may as well include other whitespace
   characters in the separator list, and you can even use the returned pointer to skip any initial whitespace.
   Try entering some spaces, 12345, and some more spaces.<br/> Alternatively, you could use strcspn like version 2
   Or, if you are really interested in the string length, then you may as well do it in the straightforward way:(version 3)
   If you are not really interested in the string length, the the strtok method is excellent since it allows you to skip initial and trailing space, and with a little extension could be used to detect extraneous (presumably erroneous) non-space characters after the first word.(version 4)
   This considers one two an error, but  one is okay (and is interpreted as one). (I meant to add a few spaces before and after one, but the forum reduces them to one space.)",'include &lt;string.h> int main() ');
--\n 
--{\n    char str[100];\n \n    while (1) {\n        puts("Enter the ID:");\n        if (fgets(str, sizeof str, stdin) == NULL)\n            break;\n        char *p = NULL;\n        if ((p = strtok(str, " \t\n")) == NULL)\n            continue;\n        printf("size of string %d\n", (int)strlen(p));\n    }\n \n    return 0\n}\n//version 2\n#include &lt;stdio.h>\n#include &lt;string.h>\n \nint main() {\n    char str[100];\n \n    while (1) {\n        puts("Enter the ID:");\n        if (fgets(str, sizeof str, stdin) == NULL)\n            break;\n        str[strcspn(str, "\n")] = '\0';\n        printf("size of string %d\n", (int)strlen(str));\n    }\n \n    return 0;\n}\n
Insert into Post (likes,createtime,creator,topicid,parent,explain,code) 
values (54,datetime('now'),4,1,0,'If at the prompt, the user justs presses the [Enter] key, 
a newline will be input, and the strlen(buffer.idarea) will beone, not zero!
 You need to remove the newline right after entering the string before testing the length of the string.
 Even if the user entered valid data, the newline should be removed! 
 Please read the man page for fgets().','puts("Insert the ID?");fgets(buffer.idarea, MAX, stdin);');                                                                                                                             
