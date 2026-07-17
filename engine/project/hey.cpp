#include<bits/stdc++.h>
using namespace std;
//const int mod=1e9+7;
/*long long C(long long x){if(x==0)return 0;return (63-__builtin_clzll(x))+__builtin_popcountll(x);
}*/
void solve(){int n;cin>>n;vector<int> a(n);vector<long long> ns(n);long long ps=0;
    for(int i=0;i<n;i++){
        cin>>a[i];ps+=a[i];
        ns[i]=((i+1)*(i+2))/2;
        if(ps<ns[i]){cout<<"No\n";return;}
    }
    cout<<"Yes\n";
}
int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;cin>>t;while(t--)solve();
    return 0;
}