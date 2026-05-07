'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import styles from './LocationSelector.module.css';

interface District {
  id: string;
  name: string;
  slug: string;
}

interface Place {
  id: string;
  name: string;
  slug: string;
}

interface LocationSelectorProps {
  onSelectionChange: (districtId: string | null, placeId: string | null) => void;
}

export default function LocationSelector({ onSelectionChange }: LocationSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allPlaces, setAllPlaces] = useState<any[]>([]);

  useEffect(() => {
    if (searchTerm.length > 1 && allPlaces.length === 0) {
      const fetchAllPlaces = async () => {
        try {
          const response = await fetch('/api/locations/all-places');
          const data = await response.json();
          setAllPlaces(data);
        } catch (error) {
          console.error('Error fetching all places:', error);
        }
      };
      fetchAllPlaces();
    }
  }, [searchTerm, allPlaces.length]);

  const suggestions = searchTerm.length > 1 
    ? allPlaces.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/api/locations/districts');
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchPlaces = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/locations/places?districtId=${selectedDistrict}`);
          const data = await response.json();
          setPlaces(data);
        } catch (error) {
          console.error('Error fetching places:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlaces();
      setSelectedPlace('');
      onSelectionChange(selectedDistrict, null);
    } else {
      setPlaces([]);
      setSelectedPlace('');
      onSelectionChange(null, null);
    }
  }, [selectedDistrict]);

  const handlePlaceChange = (placeId: string) => {
    setSelectedPlace(placeId);
    onSelectionChange(selectedDistrict, placeId);
  };

  const handleSuggestionClick = (place: any) => {
    setSelectedDistrict(place.districtId);
    setSelectedPlace(place.id);
    setSearchTerm(place.name);
    setShowSuggestions(false);
    onSelectionChange(place.districtId, place.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <label className={styles.label}>Quick Search</label>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.icon} />
          <input 
            type="text" 
            placeholder="Search any place in Kerala..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className={styles.input}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map(s => (
                <div 
                  key={s.id} 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(s)}
                >
                  <MapPin size={14} />
                  <span>{s.name} <small>({s.district.name})</small></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider}>OR</div>

      <div className={styles.selectors}>
        <div className={styles.selectorGroup}>
          <label className={styles.label}>District</label>
          <div className={styles.selectWrapper}>
            <MapPin size={18} className={styles.icon} />
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className={styles.select}
            >
              <option value="">All Kerala Districts</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.chevron} />
          </div>
        </div>

        <div className={`${styles.selectorGroup} ${!selectedDistrict ? styles.disabled : ''}`}>
          <label className={styles.label}>Place / Area</label>
          <div className={styles.selectWrapper}>
            <Search size={18} className={styles.icon} />
            <select 
              value={selectedPlace} 
              onChange={(e) => handlePlaceChange(e.target.value)}
              className={styles.select}
              disabled={!selectedDistrict || isLoading}
            >
              <option value="">{isLoading ? 'Loading...' : 'All Areas'}</option>
              {places.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.chevron} />
          </div>
        </div>
      </div>
    </div>
  );
}
