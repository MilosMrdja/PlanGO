using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.utils
{
    public class ApiResponse<T>
    {
        public string Status { get; set; } = "success";
        public T Data {  get; set; }
        public ApiResponse(T data) {
            Data = data;
        }
    }
}
