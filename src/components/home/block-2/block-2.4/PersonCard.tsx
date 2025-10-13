"use client";

import React from "react";
import { Card, Text, Box, ActionIcon } from "@mantine/core";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";

export interface PersonCardProps {
  name: string;
  position: string;
  imageUrl: string;
  description?: string;
  onClick?: () => void;
  cardWidth?: number;
}

const MotionCard = motion(Card as any);

// Função para gerar slug da URL
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-"); // Substitui espaços por hífens
};

export const PersonCard: React.FC<PersonCardProps> = ({
  name,
  position,
  imageUrl,
  onClick,
  cardWidth: propCardWidth,
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      const slug = generateSlug(name);
      window.location.href = `/images/team/${slug}`;
    }
  };

  // Utilizando o cardWidth se fornecido, senão usa valores padrão
  const cardWidth = propCardWidth ?? (isMobile ? 150 : 280);

  // Proporções baseadas na largura do card (imagem ~70% da altura total)
  const imageHeight = Math.floor(cardWidth); // Proporção 1:1 para a imagem
  const cardHeight = imageHeight + (isMobile ? 80 : 100); // Espaço para texto

  return (
    <MotionCard
      shadow="md"
      radius="xl"
      p={0}
      style={{
        overflow: "hidden",
        cursor: "pointer",
        background: "white",
        minHeight: cardHeight,
        width: cardWidth,
        margin: "0 auto",
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={handleCardClick}
    >
      {/* Container da imagem */}
      <Box
        style={{
          position: "relative",
          height: imageHeight,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "top",
          }}
          sizes={`${cardWidth}px`}
          priority={false}
        />

        {/* Overlay gradient sutil */}
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
          }}
        />
      </Box>

      {/* Informações */}
      <Box p={isMobile ? "md" : "lg"} ta="center">
        <Text
          fw={700}
          size={isMobile ? "sm" : "lg"}
          mb="xs"
          c="dark.7"
          lh={1.3}
        >
          {name}
        </Text>

        <Text
          size={isMobile ? "xs" : "sm"}
          c="dimmed"
          mb="xs"
          lh={1.4}
          fw={500}
        >
          {position}
        </Text>
      </Box>
    </MotionCard>
  );
};

export default PersonCard;
