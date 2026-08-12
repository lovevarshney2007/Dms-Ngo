// src/hooks/useSiteData.js
import { useState, useEffect, useCallback } from "react";
import { getTeam, getGallery, getEvents, getContent, getHeroSlides, formatImageUrl } from "../lib/api";

export function useTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getTeam()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setTeam(data.map(member => ({ ...member, image: formatImageUrl(member.image) })));
        } else {
          setTeam([]);
        }
      })
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { team, loading, refetch };
}

export function useGallery(initiative) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getGallery(initiative)
      .then((data) => {
        if (data && Array.isArray(data)) {
          setImages(data.map(img => ({ ...img, url: formatImageUrl(img.url) })));
        } else {
          setImages([]);
        }
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [initiative]);

  useEffect(() => { refetch(); }, [refetch]);
  return { images, loading, refetch };
}

export function useHeroSlides(initiative) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getHeroSlides(initiative)
      .then((data) => {
        if (data && Array.isArray(data)) {
          setSlides(data.map(slide => ({ ...slide, image: formatImageUrl(slide.image) })));
        } else {
          setSlides([]);
        }
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, [initiative]);

  useEffect(() => { refetch(); }, [refetch]);
  return { slides, loading, refetch };
}

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getEvents()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setEvents(data.map(event => ({ ...event, image: formatImageUrl(event.image) })));
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { events, loading, refetch };
}

/**
 * Fetches admin-saved content for an initiative; falls back to the
 * hardcoded `defaults` (still in each initiative file) until an
 * admin saves something via the panel.
 */
export function useInitiativeContent(slug, defaults) {
  const [content, setContent] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getContent(slug)
      .then((data) => {
        if (data) {
          if (data.aboutImage) data.aboutImage = formatImageUrl(data.aboutImage);
          setContent(data);
        } else {
          setContent(defaults);
        }
      })
      .catch(() => setContent(defaults))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { content, loading };
}