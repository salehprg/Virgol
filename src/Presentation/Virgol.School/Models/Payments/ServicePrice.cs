using System.Collections.Generic;
using System.Linq;

public class ServicePrice {
    public int Id {get;set;}
    public string serviceName {get;set;}
    public int pricePerUser {get;set;}
    public float discount {get;set;}
    public string option {get;set;}
    public string OnlyUser {get;set;}
    public string ExcludeUser {get;set;}


    //e.g : Service for Server Adobe Proffesional = adobe|pro
    //Service for Server BigBlueButton Normal = bbb|norm
    //service name according to ServiceType.cs
    public string serviceType {get;set;}

    public List<int> GetOnlyUsersId()
    {
        List<int> result = new List<int>();

        if(OnlyUser != null)
        {
            List<string> idstr = OnlyUser.Split(',').ToList();
        
            foreach (var id in idstr)
            {
                int incId = 0;
                if(int.TryParse(id , out incId))
                {
                    result.Add(incId);
                }
            }
        }

        return result;
    }
    public string SetOnlyUsersId(List<int> ids)
    {
        string result = "";

        foreach (var id in ids)
        {
            if(id != 0)
            {
                result += id.ToString() + ",";
            }
        }

        OnlyUser = result;

        return result;
    }


    public List<int> GetExcludeId()
    {
        List<int> result = new List<int>();

        if(ExcludeUser != null)
        {
            List<string> idstr = ExcludeUser.Split(',').ToList();
            
            foreach (var id in idstr)
            {
                int exId = 0;
                if(int.TryParse(id , out exId))
                {
                    result.Add(exId);
                }
            }
        }

        return result;
    }
    public string SetExcludeId(List<int> ids)
    {
        string result = "";

        foreach (var id in ids)
        {
            if(id != 0)
            {
                result += id.ToString() + ",";
            }
        }

        ExcludeUser = result;

        return result;
    }

}