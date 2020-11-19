using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

class LessonsComperator : IEqualityComparer<LessonModel>
{
    public bool Equals(LessonModel x, LessonModel y)
    {
        if(x.LessonCode == y.LessonCode)
            return true;

        return false;
    }

    public int GetHashCode(LessonModel obj)
    {
        int hCode = obj.Id ;
        return hCode.GetHashCode();
    }
}