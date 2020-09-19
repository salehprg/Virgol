using System;
using Xunit;

namespace Virgol.Tests
{
    public class UnitTest1
    {
        [Fact]
        public void PassingTest()
        {
            Assert.Equal(4, Add(2, 2));
        }

        [Fact]
        public void FailingTest()
        {
            Assert.Equal(8, Add(2, 6));
        }

        int Add(int x, int y)
        {
            return x + y;
        }
    }
}
