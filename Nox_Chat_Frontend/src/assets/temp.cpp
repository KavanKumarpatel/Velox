// #include<iostream>
// #include<vector>
// using namespace std;
// int main(){
//     vector<string> v = {
//         "Nikhil", "Nakul", "Nitin", "Sagar", "Kapil", "Navin", "Sahil"
//     };

//     vector<string> sorted;

//     int a = 30;
//     while(a--){
//         string q;
//         cin>>q;
//     for(int i = 0; i < v.size(); i++){
//         bool flag = true;
//         for(int j = 0, k = 0; j < v[i].size() && k < q.size(); j++, k++){
//             if(v[i][j] != q[k]){
//                 flag = false;
//             }
//         }
//         if(flag) sorted.push_back(v[i]);
//    }

//    for(int i = 0; i < sorted.size(); i++){
//       cout<<sorted[i]<<endl;
//    }
//        sorted.clear();

//     }

   
//     return 0;
// }


#include <iostream>
#include <string>
#include <vector>
#include <stack>
using namespace std;


stack<string> reverseStack(stack<string> &s){

 stack<string> reversedStack;

while(s.size() != 0 ){
reversedStack.push(s.top());
    s.pop();
}
return reversedStack;
}

string getTagName(string &a){
    string ans;
    for(int i = 0; i < a.size(); i++){
        if(a[i] != '/' && a[i] != '<' && a[i] != '>'){
            ans.push_back(a[i]);
        }
    }
    return ans;
}

void print(stack<string> s){
    while (s.size() != 0)
    {
        cout<<s.top()<<endl;
        s.pop();
    }
     cout<<endl;
}


string StringChallenge(string str) {

    string result = "true";

vector<string> allTags;
  int i = 0;

  while(i < str.size()){

    string tag;

    if(str[i] == '<'){
       while(str[i] != '>'){
         tag.push_back(str[i]);
         i++;
       }

       tag.push_back('>');
      
       allTags.push_back(tag);
       tag.clear();

    }
    
    i++;
 }

stack<string>s;

 for(int i = 0; i < allTags.size(); i++){

    if(allTags[i].substr(0, 2) != "</"){
       s.push(allTags[i]);
    }

   else{

     if(s.empty())
    {
        result = getTagName(allTags[i]);
        return result;
    }

    string tag = s.top();
    tag.insert(1, "/");
    cout<<tag<<" - "<<allTags[i]<<endl;
    
    if(allTags[i] == tag){
        s.pop();
    }
    else {
        return getTagName(s.top());
    }
   }
 }

return result;
}

int main(void) { 
   

  // keep this function call here
  cout << StringChallenge("<div>abc</div><p><em><i>test test test</b></em></p>");
  return 0;
    
}