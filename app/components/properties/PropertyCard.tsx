'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from '../styles/PropertyCard.module.css'

interface Address {
  street: string
  houseNumber: number
  addressAdditional: string
  city: string
  postalCode: string
  country: string
}

interface Property {
  id: number
  name: string
  type: string
  description: string
  address: Address
  maxGuests: number
  pricePerNight: number
  images: string[]
}

export function PropertyCard({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    )
  }

  return (
    <Card className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className={styles.image}
        />
        <button onClick={prevImage} className={`${styles.imageButton} ${styles.prevButton} ${styles.smallButton}`}>
          <ChevronLeft className={styles.buttonIcon} />
        </button>
        <button onClick={nextImage} className={`${styles.imageButton} ${styles.nextButton} ${styles.smallButton}`}>
          <ChevronRight className={styles.buttonIcon} />
        </button>
        <div className={styles.imageDots}>
          {property.images.map((_, index) => (
            <span 
              key={index} 
              className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{property.name}</h3>
        <p className={styles.address}>
          {property.address.city}, {property.address.country}
        </p>
        <p className={styles.address}>
          {property.address.street} {property.address.houseNumber}
          {property.address.addressAdditional && `, ${property.address.addressAdditional}`}
        </p>
        <p className={styles.type}>{property.type}</p>
        <p className={styles.dates}>
          {new Date().getDate()}-{new Date().getDate() + 5}.{" "}
          {new Date().toLocaleString("default", { month: "short" })}
        </p>
        <p className={styles.price}>
          {property.pricePerNight.toLocaleString("de-DE", {
            style: "currency",
            currency: "EUR",
          })}
          <span className={styles.pricePerNight}> / Nacht</span>
        </p>
      </div>
    </Card>
  )
}

