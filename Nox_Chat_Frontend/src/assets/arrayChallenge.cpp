#include<iostream>
#include<unordered_map>
#include<unordered_set>
#include<list>
using namespace std;




string ArrayChallenge(string strArr[], int arrLength) {

    string result = "true";

  unordered_map<int, list<int>> m;

  for(int i = 0; i < arrLength; i++){
    string str = strArr[i];
    int a = stoi(str.substr(1,1)), b = stoi(str.substr(3,1));
    if(m[b].size() == 1){
        for(auto x : m[b]){
       if(b > a && b < x || b > x && b < a) continue;
       else return "false";
        }
    }
    m[b].push_back(a);
    if(m[b].size() > 2) return "false";
  }
  
  return result;
}


int main(){

// string a[] = {"(1,2)", "(3,2)", "(2,12)", "(5,2)"};
string a[] = {"(1,2)", "(2,4)", "(5,7)", "(7,2)", "(9,5)"};

cout<<ArrayChallenge(a, 5);

    return 0;
}