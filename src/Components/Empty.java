public static int bruteforce(int[] power){
    int res = 0;
    int prev = power[0];
    for(int i=1;i<power.length;i++){
        if(power[i]<prev){
            int val = prev-power[i];
            for(int j=i;j<power.length;j++){
                power[j]+=val;
            }
            res+=val;
        }
        prev = power[i];
    }
    return res;
}

public static int greedy(int[] power){
    int res = 0;
    int prev = power[0];
    for(int i=1;i<power.length;i++){
        power[i]+=res;
        if(power[i]<prev){
            int val = prev-power[i];
            power[i]+=val;
            res+=val;
        }
        prev = power[i];
    }
    return res;
}
