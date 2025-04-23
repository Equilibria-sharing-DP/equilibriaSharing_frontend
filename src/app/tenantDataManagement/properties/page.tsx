"use client";

import { useEffect, useState } from 'react';
import { accommodationService } from '@/services/accommodationService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  pictureUrls: string[];
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAdditional?: string;
}

export default function PropertiesPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      const data = await accommodationService.getAllAccommodations();
      setAccommodations(data);
      setError(null);
    } catch (err) {
      setError('Fehler beim Laden der Immobilien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Möchten Sie diese Immobilie wirklich löschen?')) {
      try {
        setIsDeleting(id);
        await accommodationService.deleteAccommodation(id);
        const updatedAccommodations = accommodations.filter(acc => acc.id !== id);
        setAccommodations(updatedAccommodations);
        alert('Immobilie wurde erfolgreich gelöscht');
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        setError('Fehler beim Löschen der Immobilie. Bitte stellen Sie sicher, dass Sie eingeloggt sind.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadAccommodations} className="mt-4">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Immobilien Übersicht</h1>
          <div className="flex space-x-3">
            <Link href="/tenantDataManagement/properties/generate-link">
            <Button className="bg-[#A8C947] text-white hover:bg-[#97B83B]">
              Link generieren
            </Button>
            </Link>
          <Button 
            className="bg-[#A8C947] text-white hover:bg-[#97B83B]"
            onClick={() => window.location.href = '/tenantDataManagement/properties/add'}
          >
            Neue Immobilie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accommodations.map((accommodation) => (
          <Card key={accommodation.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{accommodation.name}</CardTitle>
              <CardDescription>{accommodation.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{accommodation.description}</p>
                <p className="font-semibold">€{accommodation.pricePerNight} pro Nacht</p>
                <p>Max. Gäste: {accommodation.maxGuests}</p>
                <p className="text-sm">
                  {accommodation.street} {accommodation.houseNumber}<br />
                  {accommodation.postalCode} {accommodation.city}<br />
                  {accommodation.country}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end mt-auto">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => router.push(`/tenantDataManagement/properties/${accommodation.id}`)}
              >
                Details
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleDelete(accommodation.id)}
              >
                Löschen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

