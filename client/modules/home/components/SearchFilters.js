"use client";
import React, { useState, useEffect } from 'react';
import { usePropertyFilters } from "@/modules/global_components/context_files/PropertyFilterContext";

const SearchFilters = ({ onFilterChange, activeFilters }) => {
  const { filters, updateFilter, resetFilters } = usePropertyFilters();
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [customBathrooms, setCustomBathrooms] = useState('');
  const [customParking, setCustomParking] = useState('');
  const [customRooms, setCustomRooms] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const propertyTypeOptions = [
    "Casa",
    "Departamento",
    "Cuarto"
  ];

  const genderOptions = [
    "Solo hombres",
    "Solo mujeres",
    "Mixto"
  ];

  const furnishedOptions = [
    "Sí",
    "No"
  ];

  const bathroomTypeOptions = [
    "Propio",
    "Compartido"
  ];

  const numberOfBathroomsOptions = [
    "1", "2", "3", "+" 
  ];

  const moreBathroomsOptions = [
    "4", "5", "6", "7", "8", "9", "10" 
  ];

  const servicesOptions = [
    "Con servicios",
    "Sin servicios"
  ];

  const parkingYesNoOptions = [
    "Sí",
    "No"
  ];

  const numberOfParkingSpacesOptions = [
    "1", "2", "3", "+" 
  ];

  const moreParkingSpacesOptions = [
    "4", "5", "6", "7", "8", "9", "10" 
  ];

  const numberOfRoomsOptions = [
    "1", "2", "3", "4", "5", "+" 
  ];

  const moreRoomsOptions = [
    "6", "7", "8", "9", "10"
  ];

  const amenitiesList = [
    "Casa Club",
    "Alberca",
    "Gym",
    "Jardín",
    "Asadores",
    "Pista para correr",
    "Actividades deportivas",
    "Lavadora",
    "Secadora",
    "Hamaca",
    "Roof-top",
    "Estacionamiento techado"
  ];

  const serviciosIncluidosList = [
    "Luz",
    "Agua",
    "Gas",
    "Internet",
    "Limpieza",
    "Mantenimiento",
    "Agua potable"
  ];

  const securityOptions = [
    "Condominio privado con seguridad 24/7",
    "Edificio con seguridad 24/7"
  ];

  const MIN_PRICE = 3500;
  const MAX_PRICE = 35000;
  const STEP = 500;

  const handleFilterChangeInternal = (newFilterValue) => {
    const updatedFilters = { ...filters, ...newFilterValue };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters); // Notificar al componente padre inmediatamente
  };

  const handlePropertyTypeSelect = (type) => {
    // Resetear los filtros de baño y estacionamiento si el tipo de propiedad cambia
    const newFilters = { 
      propertyType: type === filters.propertyType ? '' : type,
      bathroomType: '', 
      numberOfBathrooms: '',
      parking: '', 
      numberOfParkingSpaces: '',
      numberOfRooms: '' 
    };
    handleFilterChangeInternal(newFilters);
  };

  const handleGenderSelect = (gender) => {
    handleFilterChangeInternal({ gender: gender === filters.gender ? '' : gender });
  };

  const handleFurnishedSelect = (option) => {
    handleFilterChangeInternal({ furnished: option === filters.furnished ? '' : option });
  };

  const handleBathroomTypeSelect = (option) => {
    handleFilterChangeInternal({ bathroomType: option === filters.bathroomType ? '' : option });
  };

  const handleNumberOfBathroomsSelect = (option) => {
    updateFilter("numberOfBathrooms", option);
  };

  const handleMoreBathroomsSelect = (e) => {
    const value = e.target.value;
    setCustomBathrooms(value);
    handleFilterChangeInternal({ numberOfBathrooms: value });
  };

  const handleServicesSelect = (option) => {
    handleFilterChangeInternal({ services: option === filters.services ? '' : option });
  };

  const handleParkingSelect = (option) => {
    // Resetear número de lugares si se selecciona "No"
    const newFilters = { 
      parking: option === filters.parking ? '' : option,
      numberOfParkingSpaces: option === "No" ? '' : filters.numberOfParkingSpaces 
    };
    handleFilterChangeInternal(newFilters);
  };

  const handleNumberOfParkingSpacesSelect = (option) => {
    updateFilter("parking", option);
  };

  const handleMoreParkingSpacesSelect = (e) => {
    const value = e.target.value;
    setCustomParking(value);
    handleFilterChangeInternal({ numberOfParkingSpaces: value });
  };

  const handleNumberOfRoomsSelect = (option) => {
    updateFilter("numberOfRooms", option);
  };

  const handleMoreRoomsSelect = (e) => {
    const value = e.target.value;
    setCustomRooms(value);
    handleFilterChangeInternal({ numberOfRooms: value });
  };

  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateFilter("maxBudget", value);
  };

  const handlePetFriendlyChange = (e) => {
    updateFilter("petFriendly", e.target.checked);
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    const updatedAmenities = checked
      ? [...filters.amenities, value]
      : filters.amenities.filter(amenity => amenity !== value);
    updateFilter("amenities", updatedAmenities);
  };

  const clearFilters = () => {
    const resetFilters = {
      propertyType: '',
      gender: '',
      furnished: '',
      bathroomType: '',
      numberOfBathrooms: '',
      maxBudget: MAX_PRICE,
      amenities: [],
      petFriendly: false,
      services: '',
      parking: '',
      numberOfParkingSpaces: '',
      numberOfRooms: '', 
      budgetFilterActive: false
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Agregar funciones de estilos para react-select
  const getSelectStyles = (selectedValue) => ({
    control: (base, state) => ({
      ...base,
      minHeight: '36px',
      borderRadius: '0.375rem',
      borderColor: '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 1px #FFDC30' : base.boxShadow,
      '&:hover': { borderColor: '#FFDC30' },
      backgroundColor: '#FFDC30 !important', // Forzar amarillo con !important
      background: '#FFDC30 !important',
      color: '#000',
      transition: 'background-color 0.2s',
    }),
    option: (base) => ({
      ...base,
      backgroundColor: 'white',
      color: '#374151',
      fontWeight: 400,
      fontSize: '0.95rem',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#000',
      fontWeight: 600,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 20,
    })
  });

  console.log('Baños:', filters.numberOfBathrooms, 'Estacionamiento:', filters.numberOfParkingSpaces, 'Cuartos:', filters.numberOfRooms);

  return (
    <div>
      <form className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-black mb-3">Tipo de vivienda</h3>
          <div className="flex flex-wrap gap-2">
            {propertyTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateFilter("propertyType", type)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.propertyType === type 
                    ? 'bg-[#FFDC30] text-black font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-black mb-3">Género compatible</h3>
          <div className="flex flex-wrap gap-2">
            {genderOptions.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => updateFilter("gender", gender)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.gender === gender 
                    ? 'bg-[#FFDC30] text-black font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-black mb-3">Amueblado</h3>
          <div className="flex flex-wrap gap-2">
            {furnishedOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFilter("furnished", option)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.furnished === option 
                    ? 'bg-[#FFDC30] text-black font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {filters.propertyType === "Cuarto" && (
          <div>
            <h3 className="text-md font-medium text-black mb-3">Baño</h3>
            <div className="flex flex-wrap gap-2">
              {bathroomTypeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateFilter("bathroomType", option)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    filters.bathroomType === option 
                      ? 'bg-[#FFDC30] text-black font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nueva categoría de Cuartos */}
        {(filters.propertyType === "Casa" || filters.propertyType === "Departamento") && (
          <div>
            <h3 className="text-md font-medium text-black mb-3">Número de cuartos</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {numberOfRoomsOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleNumberOfRoomsSelect(option)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.numberOfRooms === option && option !== "+"
                        ? 'bg-[#FFDC30] text-black font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                  {(option === "+" && (filters.numberOfRooms === "+" || parseInt(filters.numberOfRooms) > 5)) && (
                    <div className="ml-2 w-20">
                      <Select
                        options={[...Array(5)].map((_, i) => ({ value: (i + 6).toString(), label: (i + 6).toString() }))}
                        value={
                          [...Array(5)].map((_, i) => ({ value: (i + 6).toString(), label: (i + 6).toString() }))
                            .find(opt => opt.value === filters.numberOfRooms) || null
                        }
                        onChange={selected => {
                          setCustomRooms(selected.value);
                          handleFilterChangeInternal({ numberOfRooms: selected.value });
                        }}
                        isSearchable={false}
                        classNamePrefix="custom-select"
                        styles={{
                          ...getSelectStyles(filters.numberOfRooms),
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '0.875rem',
                            color: '#000',
                            backgroundColor: state.isSelected ? '#FFDC30' : '#fff',
                            fontWeight: state.isSelected ? 600 : 400,
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: '0.875rem',
                            color: '#000',
                            fontWeight: 600,
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            height: '2.5rem',
                            padding: '0 0.25rem',
                            minWidth: '56px',
                            backgroundColor: '#fff',
                            color: '#000',
                          }),
                        }}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral0: '#fff',
                            primary25: '#fff',
                            primary: '#FFDC30',
                            neutral80: '#000',
                            neutral20: '#ccc',
                            neutral30: '#ccc',
                            neutral40: '#ccc',
                          }
                        })}
                        placeholder=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Número de baños */}
        {(filters.propertyType === "Casa" || filters.propertyType === "Departamento") && (
          <div>
            <h3 className="text-md font-medium text-black mb-3">Número de baños</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {numberOfBathroomsOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleNumberOfBathroomsSelect(option)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.numberOfBathrooms === option && option !== "+"
                        ? 'bg-[#FFDC30] text-black font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                  {(option === "+" && (filters.numberOfBathrooms === "+" || parseInt(filters.numberOfBathrooms) > 3)) && (
                    <div className="ml-2 w-20">
                      <Select
                        options={[...Array(7)].map((_, i) => ({ value: (i + 4).toString(), label: (i + 4).toString() }))}
                        value={
                          [...Array(7)].map((_, i) => ({ value: (i + 4).toString(), label: (i + 4).toString() }))
                            .find(opt => opt.value === filters.numberOfBathrooms) || null
                        }
                        onChange={selected => {
                          setCustomBathrooms(selected.value);
                          handleFilterChangeInternal({ numberOfBathrooms: selected.value });
                        }}
                        isSearchable={false}
                        classNamePrefix="custom-select"
                        styles={{
                          ...getSelectStyles(filters.numberOfBathrooms),
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '0.875rem',
                            color: '#000',
                            backgroundColor: state.isSelected ? '#FFDC30' : '#fff',
                            fontWeight: state.isSelected ? 600 : 400,
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: 600,
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            height: '2.5rem',
                            padding: '0 0.25rem',
                            minWidth: '56px',
                            backgroundColor: '#fff',
                            color: '#000',
                          }),
                        }}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral0: '#fff',
                            primary25: '#fff',
                            primary: '#FFDC30',
                            neutral80: '#000',
                            neutral20: '#ccc',
                            neutral30: '#ccc',
                            neutral40: '#ccc',
                          }
                        })}
                        placeholder=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-md font-medium text-black mb-3">Servicios</h3>
          <div className="flex flex-wrap gap-2">
            {servicesOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleServicesSelect(option)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.services === option 
                    ? 'bg-[#FFDC30] text-black font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {/* Subfiltro de servicios incluidos */}
          {filters.services === "Con servicios" && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-black mb-2">¿Qué servicios?</h4>
              <div className="flex flex-col gap-2">
                {serviciosIncluidosList.map(servicio => (
                  <label key={servicio} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviciosSeleccionados.includes(servicio)}
                      onChange={() => {
                        const updated = serviciosSeleccionados.includes(servicio)
                          ? serviciosSeleccionados.filter(s => s !== servicio)
                          : [...serviciosSeleccionados, servicio];
                        setServiciosSeleccionados(updated);
                        handleFilterChangeInternal({ includedServices: updated });
                      }}
                      className="accent-[#FFDC30] w-4 h-4 rounded"
                    />
                    <span className="text-black text-sm">{servicio}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="maxBudget" className="block text-sm font-medium text-black">
              Presupuesto máximo
            </label>
            <span className="text-sm font-bold text-black">
              {filters.budgetFilterActive ? `$${formatPrice(filters.maxBudget)}` : "Desliza para seleccionar"}
            </span>
          </div>
          <input
            type="range"
            id="maxBudget"
            name="maxBudget"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={filters.maxBudget}
            onChange={handleBudgetChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFDC30]"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>${formatPrice(MIN_PRICE)}</span>
            <span>${formatPrice(MAX_PRICE)}</span>
          </div>
        </div>

        {/* Lógica condicional para Estacionamiento */}
        {filters.propertyType === "Cuarto" && (
          <div>
            <h3 className="text-md font-medium text-black mb-3">Estacionamiento</h3>
            <div className="flex flex-wrap gap-2">
              {parkingYesNoOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleParkingSelect(option)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    filters.parking === option 
                      ? 'bg-[#FFDC30] text-black font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {(filters.propertyType === "Casa" || filters.propertyType === "Departamento") && (
          <div>
            <h3 className="text-md font-medium text-black mb-3">Número de lugares de estacionamiento</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {numberOfParkingSpacesOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleNumberOfParkingSpacesSelect(option)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.numberOfParkingSpaces === option && option !== "+"
                        ? 'bg-[#FFDC30] text-black font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                  {(option === "+" && (filters.numberOfParkingSpaces === "+" || parseInt(filters.numberOfParkingSpaces) > 3)) && (
                    <div className="ml-2 w-20">
                      <Select
                        options={[...Array(7)].map((_, i) => ({ value: (i + 4).toString(), label: (i + 4).toString() }))}
                        value={
                          [...Array(7)].map((_, i) => ({ value: (i + 4).toString(), label: (i + 4).toString() }))
                            .find(opt => opt.value === filters.numberOfParkingSpaces) || null
                        }
                        onChange={selected => {
                          setCustomParking(selected.value);
                          handleFilterChangeInternal({ numberOfParkingSpaces: selected.value });
                        }}
                        isSearchable={false}
                        classNamePrefix="custom-select"
                        styles={{
                          ...getSelectStyles(filters.numberOfParkingSpaces),
                          option: (provided, state) => ({
                            ...provided,
                            fontSize: '0.875rem',
                            color: '#000',
                            backgroundColor: state.isSelected ? '#FFDC30' : '#fff',
                            fontWeight: state.isSelected ? 600 : 400,
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            fontSize: '0.8rem',
                            color: '#000',
                            fontWeight: 600,
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            height: '2.5rem',
                            padding: '0 0.25rem',
                            minWidth: '56px',
                            backgroundColor: '#fff',
                            color: '#000',
                          }),
                        }}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral0: '#fff',
                            primary25: '#fff',
                            primary: '#FFDC30',
                            neutral80: '#000',
                            neutral20: '#ccc',
                            neutral30: '#ccc',
                            neutral40: '#ccc',
                          }
                        })}
                        placeholder=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="petFriendly"
            name="petFriendly"
            checked={filters.petFriendly}
            onChange={handlePetFriendlyChange}
            className="h-4 w-4 text-[#FFDC30] focus:ring-[#FFDC30] border-gray-300 rounded"
          />
          <label htmlFor="petFriendly" className="ml-2 block text-sm text-black">
            Pet Friendly
          </label>
        </div>
        
        <div>
          <button
            type="button"
            onClick={toggleMoreFilters}
            className="text-sm font-medium text-black flex items-center"
          >
            {showMoreFilters ? 'Menos filtros' : 'Más filtros'}
            <svg 
              className={`ml-1 w-4 h-4 transition-transform ${showMoreFilters ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {showMoreFilters && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-black mb-3">Amenidades</h3>
            <div className="grid grid-cols-1 gap-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    id={`amenity-${amenity}`}
                    name="amenities"
                    value={amenity}
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    className="h-4 w-4 text-[#FFDC30] focus:ring-[#FFDC30] border-gray-300 rounded"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-600">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            {/* Categoría de Seguridad */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-black mb-3">Seguridad</h3>
              <div className="flex flex-wrap gap-2">
                {securityOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleFilterChangeInternal({ securityType: filters.securityType === option ? '' : option })}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      filters.securityType === option
                        ? 'bg-[#FFDC30] text-black font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4 space-y-3">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition duration-300"
          >
            Limpiar filtros
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;

// DONE
