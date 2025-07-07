﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces.Mappers
{
    public interface ILocationMapper
    {
        LocationDTO toResponseDTO(Location location);
    }
}
